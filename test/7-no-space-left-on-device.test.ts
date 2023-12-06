import { describe, expect, test } from 'vitest';
import {
  parseLine,
  part1,
  part2,
  storageUsed,
  updateEnvironment,
  type Directory,
  type Environment,
  type Line,
} from '../src/lib/7-no-space-left-on-device.js';

test('part1', () => {
  expect(part1(exampleInput)).toBe(95437);
});

test('part2', () => {
  expect(part2(exampleInput)).toBe(24933642);
});

describe('parseLine', () => {
  const testCases: [string, Line][] = [
    ['$ cd /', { command: 'cd', path: '/' }],
    ['$ ls', { command: 'ls' }],
    ['123, x.txt', { content: 'file', name: 'x.txt', size: 123 }],
    ['dir di', { content: 'directory', name: 'di' }],
    ['$ cd a', { command: 'cd', path: 'a' }],
  ];

  test.each(testCases)('%s => %j', (line, expected) => {
    expect(parseLine(line)).toEqual(expected);
  });
});

describe('updateEnvironment', () => {
  test('cd subDir', () => {
    const subDir: Directory = {
      parent: null,
      contents: new Map(),
    };
    const root: Directory = {
      parent: null,
      contents: new Map([['s', subDir]]),
    };
    subDir.parent = root;
    const env: Environment = { root, workingDirectory: root };

    const updatedEnv = updateEnvironment(env, { command: 'cd', path: 's' });

    const expected: Environment = { root, workingDirectory: subDir };

    expect(updatedEnv).toEqual(expected);
  });

  test('cd /', () => {
    const root: Directory = {
      parent: null,
      contents: new Map(),
    };
    const subDir: Directory = {
      parent: root,
      contents: new Map(),
    };
    const env: Environment = { root, workingDirectory: subDir };

    const updatedEnv = updateEnvironment(env, { command: 'cd', path: '/' });

    const expected: Environment = { root, workingDirectory: root };

    expect(updatedEnv).toEqual(expected);
  });

  test('cd ..', () => {
    const root: Directory = {
      parent: null,
      contents: new Map(),
    };
    const subDir: Directory = {
      parent: root,
      contents: new Map(),
    };
    const env: Environment = { root, workingDirectory: subDir };

    const updatedEnv = updateEnvironment(env, { command: 'cd', path: '..' });

    const expected: Environment = { root, workingDirectory: root };

    expect(updatedEnv).toEqual(expected);
  });

  test('ls', () => {
    const env: Environment = {
      root: {
        parent: null,
        contents: new Map([
          [
            'a',
            {
              parent: null,
              contents: new Map(),
            },
          ],
        ]),
      },
      workingDirectory: {
        parent: null,
        contents: new Map(),
      },
    };

    const updatedEnv = updateEnvironment(env, { command: 'ls' });

    expect(updatedEnv).toEqual(env);
  });

  test('directory content', () => {
    const root: Directory = {
      parent: null,
      contents: new Map(),
    };
    const env: Environment = { root, workingDirectory: root };

    const updatedEnv = updateEnvironment(env, {
      content: 'directory',
      name: 'x',
    });

    const expectedNewDir: Directory = { parent: null, contents: new Map() };
    const expectedNewRoot: Directory = {
      parent: null,
      contents: new Map([['x', expectedNewDir]]),
    };
    expectedNewDir.parent = expectedNewRoot;
    const expected: Environment = {
      root: expectedNewRoot,
      workingDirectory: expectedNewRoot,
    };

    expect(updatedEnv).toEqual(expected);
  });

  test('file contents', () => {
    const env: Environment = {
      root: { parent: null, contents: new Map() },
      workingDirectory: { parent: null, contents: new Map() },
    };

    const updatedEnv = updateEnvironment(env, {
      content: 'file',
      name: 'test',
      size: 12,
    });

    const expected: Environment = {
      root: {
        parent: null,
        contents: new Map(),
      },
      workingDirectory: {
        parent: null,
        contents: new Map([['test', { size: 12 }]]),
      },
    };

    expect(updatedEnv).toEqual(expected);
  });
});

test('storageUsed', () => {
  const root: Directory = {
    parent: null,
    contents: new Map([
      ['a', { parent: null, contents: new Map([['f', { size: 1 }]]) }],
      ['b', { size: 2 }],
    ]),
  };

  expect(storageUsed(root)).toBe(3);
});

const exampleInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;
