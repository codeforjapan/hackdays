# オープンソースプロジェクトのマッチングプラットフォーム

Hack Days はオープンソースプロジェクトを探してマッチングし、善きプロジェクトと善き人々をつなげるためのプラットフォームです。
現在開発中。

## ウェブサイト

開発中です。乞うご期待！

## 前提要件

- Git
- Docker (デーモンを予め起動させておく)
- Supabase CLI (使い方は[こちら](https://github.com/supabase/cli)(英語))

## 開発を始める

### レポジトリを準備

```bash
git clone https://github.com/codeforjapan/hackdays.git
```

### Supabase のローカルインスタンスを起動

```bash
supabase start
```

下記のような出力が得られるので、 `anon key` をコピーしておく。

```text
         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.ZopqoUt20nEV9cklpv9e3yw3PVyZLmKs5qLD6nGL1SI
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.M2d2z4SFn5C7HlJlaSLfrzuYim9nbY_XI40uWFN3hEE
```

### `.env.development.local` を作成

サンプルの .env ファイルをコピーする

```bash
cp .env.development.local.sample .env.development.local
vi .env.development.local
```

`YOUR_ANON_KEY_HERE` を上記ステップでコピーした `anon key` と置き換える。

```text
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE <- replace this
```

注: [app.supabase.io](https://app.supabase.io/) などの、（リモートで）ホストされてるインスタンスに接続させたい場合は、ダッシュボードから `API URL` と `anon key` を取得する。（詳しくは [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) ）

### 開発用サーバーを起動

```bash
# 依存パッケージをインストール
yarn install
# ウェブサイトを起動
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと結果が見える。

[http://localhost:54323/](http://localhost:54323/) で [Supabase Studio](https://github.com/supabase/supabase/tree/master/studio) にアクセスできる。

[http://localhost:54324/](http://localhost:54324/) で メールログ（[inbucket](https://github.com/inbucket/inbucket)）にもアクセスできる。

## 注意

現時点では、 Supabase [Storage](https://supabase.com/docs/guides/storage) はローカルの Supabase 環境では動作しません。 Storage を使用する機能（例: プロフィール画像など）についてチェックしたい場合は、リモートでホストされたインスタンスを使用する必要があります。

## デプロイ

[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) を確認してください

## テストを実行

### Cypress

Cypress は、E2E テストと統合テストに使われています。

テストを実行する前に、 `.env.production.local` を作成し、そこに `.env.development.local` の内容をコピーしてください。

> 注: これはアプリ全体をビルドする際に、 Supabase 関連の環境変数を定義しておく必要があるためです。CI では Supabase が構成されてない場合があるため、そこでもテストが実行できるように Supabase に接続しなくてもアプリがビルドできるようにする予定です。

Cypress テストを実行するには、まず `yarn build && yarn start` を実行し、そのあと別のターミナルで下記コマンドを実行します。

```bash
yarn cypress

# Docker 環境などで headless モードで実行したい場合は下記を実行
# yarn cypress:headless
```

Next.js サーバーと Cypress を同時に起動させたい場合は、 `start-server-and-test` パッケージが役に立つでしょう。（[詳細](https://nextjs.org/docs/testing#running-your-cypress-tests)）

### 単体テスト (Jest + React Testing Library)

単体テストは Jest と React Testing Library でできています。原則 `__test__/` ディレクトリ下にあります。

`yarn test` ではテストを watch モードで実行するため、ファイルが変更されるとテストが再実行されます。`yarn test:ci` では CI 環境用に、一度だけ実行します。

## ライセンス

MIT License

## プロジェクトについてもっと知る

プロジェクトについてもっと知りたい方は、[こちらのドキュメントページ](https://hackmd.io/@codeforjapan/Hkc4eIKht/)をご覧ください。
