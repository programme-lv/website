This is a [Next.js](https://nextjs.org/) project.

## Getting Started

Once you have yarn installed, you can run the following commands:
```bash
yarn install
yarn dev
```

## Git workflow & CI/CD

The two core branches of this repo are: `dev` & `main`:

- `dev` is the branch that contains the latest development version of the code.
You can push to this branch directly, but it is recommended to
create a feature branch and then create a pull request to `dev`.

- `main` is a staging branch, where the code is tested before being deployed to production.
If a commit is tagged it is then deployed to production.

For more CI/CD information look at actions defined in `./.github/workflows/`.

## Contributing

When contributing to this repository, please first discuss the change you wish
to make via issue, email, or any other method with the owners of this repository
before making a change.

Pull requests are the best way to propose changes to the codebase. We actively
welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
3. Issue that pull request!

Join our community on [Discord](https://discord.gg/7c8GwpGt)!

