# openrouter-params

Override OpenRouter **temperature**, **top_p**, and **top_k** for every API request — via CLI flags, environment variables, or the `/or-params` slash command.

## Installation

Clone the repository into pi's global extensions directory:

```bash
git clone git@github.com:azmeenafandi/openrouter-params.git ~/.pi/agent/extensions/openrouter-params
```

After cloning, run `/reload` in pi (or restart pi) to pick up the extension.

> **Note:** This extension only applies when the active model's provider is `openrouter`.

## Usage

### 1. CLI flags

| Flag | Description |
|------|-------------|
| `--or-temp` | Set temperature |
| `--or-top-p` | Set top_p |
| `--or-top-k` | Set top_k |

```bash
pi --or-temp 0.6 --or-top-p 0.95 --or-top-k 20
```

### 2. Environment variables

| Variable | Description |
|----------|-------------|
| `OPENROUTER_TEMPERATURE` | Set temperature |
| `OPENROUTER_TOP_P` | Set top_p |
| `OPENROUTER_TOP_K` | Set top_k |

```bash
export OPENROUTER_TEMPERATURE=0.6
pi
```

### 3. Slash command

Use `/or-params` inside an active pi session to inspect or change overrides on the fly:

```
/or-params                              # Show current values
/or-params 0.6                          # Set temperature only
/or-params 0.6 0.95                     # Set temperature and top_p
/or-params 0.6 0.95 20                  # Set all three
```

### Priority

CLI flags (`--or-*`) take precedence over environment variables. The `/or-params` command overrides both at runtime for the duration of the session.

## How it works

The extension intercepts the `before_provider_request` event and merges the configured parameters into the request payload sent to OpenRouter. Parameters that are left at their default are omitted, letting the model's own defaults apply.

## License

MIT
