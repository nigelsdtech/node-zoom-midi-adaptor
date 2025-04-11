When writing a lot of unit tests on the same function to test different inputs and outputs, do it programmatically using json where possible to avoid repeated code.
When generating json, have the name of the test as the first element and print each element on a separate line.
When creating a new test file, do it in the ./test folder. For unit tests, do it in ./test/unit. For integration tests, do it in ./test/integration. Mirror the file structure of the ./src folder.
For now, only write tests for "Program Change", "Control Change", and "System Exclusive" messages.