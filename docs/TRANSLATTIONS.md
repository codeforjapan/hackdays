# How to manage translations

HackDays is using [Transifex Live](https://docs.transifex.com/live/introduction) for translating contents.

[https://www.transifex.com/code-for-japan/hackdays/](https://www.transifex.com/code-for-japan/hackdays/) is our Transifex project.

If you clone our website for your instance, you need to create a project on Transifex. Please let us know if you need to get translated resources.

## Add new texts

See [official doc](https://developers.transifex.com/docs/react-sdk) for seeing how to use translating functions in the code.

## Upload untranslated texts

After adding new texts, you can upload untranslated contents to Transifex by CLI tool.

You need to set `TRANSIFEX_TOKEN` and `TRANSIFEX_SECRET` in the `.env.development.local` file before running below command.

```bash:.env.development.local
TRANSIFEX_TOKEN=TRANSIFEX_TOKEN
TRANSIFEX_SECRET=TRANSIFEX_SECRET
```

Push untranslated texts to Transifex.

```bash
yarn txjs-push
```

## Display translated contents

Transifex Live supports live translations. You don't need to download resource files.

See [FAQ about Transifex Live](https://docs.transifex.com/live/faq) for more details
