# Kamal Deploy Action

This GitHub Action deploys using [Kamal](https://kamal-deploy.org/).
Supports Kamal v2.0 and later.

## Inputs

- **environment**: The environment to deploy to (e.g. staging, production).
- **registry-username**: Registry username.
- **registry-password**: Registry password.

## Usage

```yaml
steps:
  - name: Kamal Deploy
    uses: igor-alexandrov/kamal-deploy@v0.1.2
    with:
      environment: 'staging'
      kamal-registry-username: ${{ secrets.KAMAL_REGISTRY_USERNAME }}
      kamal-registry-password: ${{ secrets.KAMAL_REGISTRY_PASSWORD }}
    # Optional
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      REDIS_URL: ${{ secrets.REDIS_URL }}
      RAILS_MASTER_KEY: ${{ secrets.RAILS_MASTER_KEY }}
