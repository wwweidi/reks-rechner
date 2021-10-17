module.exports = {
    "verbose": true,
    "testEnvironment": "node",
    "roots": [
        "<rootDir>/src",
        "<rootDir>/test"
    ],
    "testMatch": [
        "**/test/**/*.+(js)",
        "**/?(*.)+(spec|test).+(ts)"
    ],
    "globals": {
        "ts-jest": {
            "tsconfig": "./test/tsconfig.json"
        }
    }
}