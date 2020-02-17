module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  moduleNameMapper: {
    "^@modules/(.*)": "<rootDir>/src/modules/$1",
    "^@store/(.*)": "<rootDir>/src/store/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],

  snapshotResolver: "<rootDir>/jest.snapshotResolver.js"
}
