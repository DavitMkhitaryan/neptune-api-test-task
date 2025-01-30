# Test Automation Project - Test Task for Neptune AI

## How to run locally
Prerequisites
- Node.js stable version installed

Steps to Run
 1. Clone the repository
 2. Add ".env" file with valid "API_TOKEN"
 3. Run ```npm install```
 4. Run ```npx playwright test``` to run all the tests
 5. Run ```npx playwright show-report test-report``` to generate and view the test report

## How to run on CI/CD
Steps to Run
 1. Open Github repository
 2. Go to "Actions" tab
 3. Select the "Playwright API Tests" workflow
 4. Click "Run" to run the api tests with manual trigger
 5. Wait for workflow run to complete
 6. Open the workflow and download test-report from artifacts
 7. Open the html file to view the report

## Test Automation Project structure
- Playwright API tests in "tests/createOrder.api.spec.ts"
- Test data inside "testData/api.data.ts" file
- API helper methods in "utils/apiHelpers.ts" file
- Playwright configurations in "playwright.config.ts" file
- Grafana k6 performance test scripts in "tests/performance" folder

## Test automation approach
All API test cases listed here https://spotless-potassium-dc4.notion.site/Neptune-API-Test-Task-Test-Results-189e5bd7762980bcb156c9beb7a04e8a are automated using Playwright's native APIRequestContext for API testing. Parametrized tests are used where possible. API test suite is run daily against the test environment on Github Actions workflow and additionaly can be run with manual trigger.

## How to run load test
The repository also includes a separate "tests/performance" folder with k6 performance test scripts including "Smoke", "Load" and "Stress" tests
Steps to Run
1. Install k6 on your local machine - https://grafana.com/docs/k6/latest/set-up/install-k6/
2. Run the corresponding script with the following CLI command - e.g. load test script: ```API_TOKEN=TOKEN k6 run tests/performance/createOrderLoad.js```
3. Observe load test results in the CLI reporter
