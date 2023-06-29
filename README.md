# Storyboard

The goal of this demo is to show the analysis of a TypeScript application in SonarCloud. We want to showcase how to apply the "Clean As You Code" methodology in practice.

We start with an Express application that represents a legacy project which we want to analyze. This Express application contains a "main" branch with the existing code. It also contains an "add-feature" branch that represents a new feature we want to develop for the application.

The full set-up can either be done as part of the demo (takes about 15 minutes), or beforehand. A branch "enable-ci-analysis" is available to move from Automatic Analysis to a CI-based analysis, with import of code coverage information.

When fully set-up, the concept of PR Quality Gate on new code can be shown as well as its independence from the main code issues. The application features basic, yet varied, issue types that can be detected by SonarCloud. In the PR, we have:

- [ ] A simple bug with no secondary location
- [ ] A bug with a secondary location on another file
- [ ] A classic taint analysis vulnerability
- [ ] A reflected XSS
- [ ] A "bad practice" code smell
- [ ] A code smell that is actually a bug
- [ ] A stylistic code smell

Additionally, we have security hotspots on the main branch:

- [ ] A slow regular expression, vulnerable to catastrophic backtracking

When setting up CI-based analysis, import of code coverage will be done by default (in the enable-ci-analysis branch).

If you want to demo SonarLint, you can also clone this project to show the issues in SonarLint. The injection vulnerabilities will not be displayed there. Some of the issues have quick fixes for them.

Connected mode can also be shown by simply following the tutorial in the IDE, which allow to synchronize silenced issues/custom quality profiles/etc...

## Running the webapp

You will need Node.js installed in the environment. You can run the following command to install the required dependencies:

```sh
npm install
```

- Copy the `.env.example` file to `.env`
- Also create an `.env.test.local` using a different `DB_NAME`
- Initialize the database with `npm run db:init`
- Run the tests with `npm test`
- Run the webapp with `npm start`

Running the web application is optional for the demo, but it can be used to make the application more visual and to show some of the bugs/vulnerabilities in practice.

# Setup instructions

We're going to set up a SonarCloud analysis on this project. We'll visualise issues on the main branch and on pull requests and see how PRs get decorated automatically.

We'll then set up a CI-based analysis and import code coverage information into the SonarCloud UI.

Useful link: https://docs.sonarcloud.io/

## Getting started

- Fork this repository, with all existing branches (by default, only the main branch is forked).
- A basic workflow which will act as our CI already exists in `.github/workflows/test.yml`. It is disabled by default. Go to `Actions` and enable GitHub Actions to activate it.
- Go to `Pull requests->New pull request` and open a pull request from the `add-feature` branch to the `main` branch of your fork. Be careful that, by default, the PR targets the upstream repository.
- The GitHub Action should run and succeed.

## First analysis on SonarCloud

We'll see how to enable SonarCloud analysis without making any changes to our CI pipeline.

- Go to https://sonarcloud.io/sessions/new and sign up using your GitHub account.
- Create a new organization under your name and give SonarCloud permission to see the forked repository.
- Go to `Analyze new project` and select the forked repository.

The first analysis should execute on the main branch first, then on the pull request. The pull request should be decorated with the analysis result.

## Adding code coverage to the analysis result

By default, source code is analyzed automatically by SonarCloud. As it is a static analysis tool, it does not execute tests and is not able to compute code coverage by itself. You'll need to generate code coverage information and run the analysis in your CI to be able to import it.

**Note:** for simplicity, the branch `enable-ci-analysis` is already created in this repository with the required changes. From this branch, you only need to:

- Define a `SONAR_TOKEN` secret in your GitHub repository with a token created in SonarCloud (see [here](#enable-ci-based-analysis)).
- Replace the placeholders in the `sonar-project.properties` file with your project information.
- Merge the `enable-ci-analysis` in your main branch, then rebase the feature branch.

If you're using the `enable-ci-analysis` branch, you can skip the rest of this section.

### Enable CI-based analysis

We'll then enable CI-based analysis using the [SonarCloud GitHub Action](https://github.com/marketplace/actions/sonarcloud-scan):

- Go to the overview of your project in SonarCloud.
- Under `Administration->Analysis Method`, turn Automatic Analysis off.
- Under `GitHub Actions`, click `Follow the tutorial`.
- Create a `SONAR_TOKEN` in your GitHub repository settings then click `Continue`.
- To the question "What option best describes your build?", select `Other`.
- Update the `.github/workflow/test.yml` file to include the SonarCloud scan. For simplicity, the final file should look like this:

```yaml
name: Node.js application

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version-file: ".nvmrc"
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Needed to get PR information, if any
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

We still need to create the analysis configuration file:

- Create a `sonar-project.properties` file the root of the repository. You can copy and paste the following (replace the placeholders with your project and organization keys)

```properties
sonar.projectKey={{YOUR_PROJECT_KEY}}
sonar.organization={{YOUR_ORGANIZATION_KEY}}

sonar.sources=src
sonar.exclusions=src/test/**/*
sonar.tests=src/test
sonar.language=ts
sonar.javascript.coverage.reportPaths=coverage/lcov.info
```

Let's commit this on the main branch and push it by running:
`git add .` then `git commit -m "Add CI analysis and coverage"` and `git push`.

Let's also rebase our PR immediately by running:
`git checkout add-feature`, `git rebase main` and `git push --force`.

A new analysis should have been triggered for the main branch as well as the pull request. When it's done, we should see the overall coverage for our project as well as the one for our PR.

# SonarLint: Fix issues before they exist

In your IDE, you can [install the SonarLint plugin](https://docs.sonarcloud.io/improving/sonarlint/) to detect issues before even committing them.

## Synchronize issues between SonarCloud and SonarLint

By default, SonarLint analyses the currently opened file with its default configuration.
It means that if you are using a different quality profile on SonarCloud, decided to silence some issues, or have an older version of the analyzer than what is available on SonarCloud there may be discrepancies between the two tools.

To remedy to that, you can use SonarLint connected mode, which will retrieve your quality profile as well as the silenced issues from SonarCloud to offer you a consistent experience.

For more information about SonarLint and its connected mode, you can visit the [SonarLint website](https://docs.sonarcloud.io/improving/sonarlint/) as well as the [SonarCloud documentation](https://docs.sonarcloud.io/improving/sonarlint/).

# Final words

Thank you for following this workshop!

If you'd like to know more, feel free to visit [our website](https://sonarsource.com/) or our [community forum](https://community.sonarsource.com/).
