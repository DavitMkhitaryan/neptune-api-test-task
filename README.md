# Test Automation Project - Test Task for Neptune AI

## How to run locally
Prerequisites
- Node.js stable version installed

Steps to Run
 1. Clone the repository
 2. Add ".env" file with valid "API_TOKEN"
 3. Run ```npm install```
 4. Run ```npx playwright test``` to runn all the tests
 5. Run ```npx playwright show-report test-report``` to generate and view the test report

## How to run on CI/CD
Steps to Run
 1. Open Github repository
 2. Go to "Actions" tab
 3. Select the "api-tests" workflow
 4. Click "Run" to run the api tests with manual trigger
 5. Wait for workflow run to complete
 6. Open the workflow and download test-report form artifacts
 7. Open the html file to view the report

## Test Automatin Project structure
- Tests in "tests/createOrder.api.spec.ts"
- Test data inside "testData/api.data.ts" file
- API helper methods in "utils/apiHelpers.ts" file
- Playwright configurations in "playwright.config.ts" file

## Test automation approach
All API test cases listed here are automated: https://spotless-potassium-dc4.notion.site/Neptune-API-Test-Task-Test-Results-189e5bd7762980bcb156c9beb7a04e8a using Playwright native APIRequestContext for API testing. Parametrized tests are used where possible.
