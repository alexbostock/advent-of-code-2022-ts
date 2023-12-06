export type Line =
  | { command: 'ls' }
  | {
      command: 'cd';
      path: string;
    }
  | {
      content: 'file';
      name: string;
      size: number;
    }
  | {
      content: 'directory';
      name: string;
    };

export interface Environment {
  root: Directory;
  workingDirectory: Directory;
}

export interface Directory {
  parent: Directory | null;
  contents: Map<string, Directory | File>;
}

export interface File {
  size: number;
}

export function part1(input: string): number {
  const root = analyseFileSystem(input);

  let sum = 0;

  for (const directory of allDirectories(root)) {
    const storageUsedInDir = storageUsed(directory);
    if (storageUsedInDir <= 100000) {
      sum += storageUsedInDir;
    }
  }

  return sum;
}

export function part2(input: string): number {
  const root = analyseFileSystem(input);

  const rootSize = storageUsed(root);
  const targetSize = 70000000 - 30000000;

  let smallestDirectorySizeToSolve = Infinity;

  for (const directory of allDirectories(root)) {
    const storageusedInDir = storageUsed(directory);
    if (rootSize - storageusedInDir <= targetSize) {
      smallestDirectorySizeToSolve = Math.min(
        smallestDirectorySizeToSolve,
        storageusedInDir,
      );
    }
  }

  return smallestDirectorySizeToSolve;
}

function analyseFileSystem(input: string): Directory {
  const root: Directory = {
    parent: null,
    contents: new Map(),
  };
  const env: Environment = { root, workingDirectory: root };

  const lines = input
    .split('\n')
    .filter(val => val !== '')
    .map(parseLine);
  for (const line of lines) {
    updateEnvironment(env, line);
  }

  return env.root;
}

export function parseLine(input: string): Line {
  if (input.startsWith('$ ls')) {
    return { command: 'ls' };
  } else if (input.startsWith('$ cd')) {
    const [_dollar, _cd, path] = input.split(' ');
    return { command: 'cd', path };
  } else if (input.startsWith('dir')) {
    const [_dir, name] = input.split(' ');
    return { content: 'directory', name };
  } else {
    const [size, name] = input.split(' ');
    return { content: 'file', name, size: parseInt(size) };
  }
}

export function updateEnvironment(env: Environment, line: Line): Environment {
  if ('command' in line && line.command === 'cd') {
    switch (line.path) {
      case '/': {
        env.workingDirectory = env.root;
        break;
      }
      case '..': {
        if (env.workingDirectory.parent === null) {
          throw new Error('Cannot cd up from root');
        }
        env.workingDirectory = env.workingDirectory.parent;
        break;
      }
      default: {
        const dir = env.workingDirectory.contents.get(line.path);
        if (!dir || 'size' in dir) {
          throw new Error('Cannot cd to non-directory');
        }
        env.workingDirectory = dir;
        break;
      }
    }
  } else if ('content' in line && line.content === 'directory') {
    env.workingDirectory.contents.set(line.name, {
      parent: env.workingDirectory,
      contents: new Map(),
    });
  } else if ('content' in line && line.content == 'file') {
    env.workingDirectory.contents.set(line.name, {
      size: line.size,
    });
  }

  return env;
}

export function* allDirectories(dir: Directory): Generator<Directory> {
  for (const content of dir.contents.values()) {
    if ('parent' in content) {
      yield content;
      yield* allDirectories(content);
    }
  }
}

export function storageUsed(dir: Directory): number {
  return [...dir.contents.values()]
    .map(content => ('size' in content ? content.size : storageUsed(content)))
    .reduce((sum, num) => sum + num);
}
