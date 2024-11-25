# Kamal Deploy Action

This GitHub Action deploys using [Kamal](https://kamal-deploy.org/).
Supports Kamal v2.0 and later.

## Inputs

To update the README to reflect the optional `environment` input, you can modify the usage section to indicate that `environment` is no longer required and explain how the action behaves when `environment` is omitted.

Here's how the README might look:

---

# Kamal Deploy GitHub Action

This GitHub Action deploys your application using Kamal and handles cancellation gracefully.

## Inputs

| Name                     | Description                                                | Required | Default     |
|--------------------------|------------------------------------------------------------|----------|-------------|
| `environment`            | Optional deployment environment (e.g., `production`, `staging`). If omitted, the `--destination` flag is not passed. | No       | None        |
| `registry-username`| Registry Username (e.g., Digital Ocean Access Token) | Yes      |             |
| `registry-password`| Registry Password (e.g., Digital Ocean Access Token) | Yes      |             |
| `kamal-path`             | Path to the Kamal binary file.                             | No       | `./bin/kamal` |

## Usage

> **Note:** Only `registry-username` and `registry-password` are required. Any other necessary configuration, such as `DATABASE_URL`, `REDIS_URL`, and `RAILS_MASTER_KEY`, should be provided as environment variables in the workflow file.

```yaml
steps:
  - name: Kamal Deploy
    uses: igor-alexandrov/kamal-deploy@v0.2.0
    with:
      # environment: 'staging'  # Optional, only used if provided
      registry-username: ${{ secrets.KAMAL_REGISTRY_USERNAME }}
      registry-password: ${{ secrets.KAMAL_REGISTRY_PASSWORD }}
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      REDIS_URL: ${{ secrets.REDIS_URL }}
      RAILS_MASTER_KEY: ${{ secrets.RAILS_MASTER_KEY }}
```