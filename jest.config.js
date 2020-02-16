module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "testEnvironment": "jsdom",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "moduleNameMapper": {
    "^@modules/(.*)": "<rootDir>/src/modules/$1",
    "^@store/(.*)": "<rootDir>/src/store/$1",
  },
  "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"],
  "watchPlugins": [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
}
