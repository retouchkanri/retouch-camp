# Retouch Horse Garden

大阪府河内長野市、1日4組限定の体験型ホースキャンプ場「Retouch Horse Garden」の公式サイト・予約システム・管理ダッシュボードです。

- **公式サイト**: コンセプト、体験紹介、サイト案内、安全ルール、料金、アクセス、FAQ、お問い合わせ、Retouch引退馬支援活動とのつながり
- **予約システム**: 日付選択→サイト種別→人数→オプション→申込→管理者承認、自動確認メール、キャンセル
- **会員機能**: メール/パスワードでの新規登録・ログイン、アバター画像アップロード、マイページでの予約履歴確認
- **データ収集**: 地域・利用形態・利用目的・希望体験・宿泊スタイル・来場きっかけ・リピート意向を予約時に収集
- **満足度アンケート**: 滞在後にメールでアンケートを送信し、自由記述をキーワードタグ化して集計
- **管理ダッシュボード**: 予約一覧・カレンダー・売上/稼働率・アンケート結果・口コミ管理・月次レポート（CSV出力）・ユーザー管理（CRUD）

スタック: **Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / Supabase (Postgres + Auth)**。

## 1. セットアップ

```bash
npm install
```

`.env.local` に Supabase の接続情報が入っています（Supabaseプロジェクトの Settings → API から取得したもの）。メール送信を有効にする場合は [Resend](https://resend.com) の API キーを `RESEND_API_KEY` に設定してください（未設定でも他の機能はすべて動作し、メールはコンソールログに出力されるだけになります）。

## 2. データベーススキーマの適用（必須・初回のみ）

このプロジェクトに渡されているAPIキーはデータの読み書き用のキーで、テーブル作成（DDL）はできない仕様のため、以下の手順で一度だけ手動適用してください。

1. [Supabaseダッシュボード](https://supabase.com/dashboard/project/rqxtefaiwrcpwigzvdmr) を開く
2. 左メニュー **SQL Editor** → **New query**
3. `supabase/migrations/0001_init.sql` の中身を全部貼り付けて **Run**
4. 同様に `supabase/migrations/0002_users_and_avatars.sql` も貼り付けて **Run**（会員機能・アバター用ストレージ・権限まわりの修正が入っています）

**⚠️ 0002を必ず適用してください。** 0001だけの状態だと、新規ユーザー作成トリガーが「新規登録者は全員 admin 権限」というテスト用の初期状態のままです。0002で「一般登録は customer、権限昇格は service-role 経由のみ」という安全な設計に切り替わります。`/signup` を公開する前に必ず適用してください。

これで以下が作成されます。

- `profiles` / `site_settings` / `site_types` / `experience_options` / `bookings` / `booking_options` / `surveys` / `reviews` / `contact_messages`
- サイト種別（キャンピングカーサイト・フリーサイト）と体験オプション（ふれあい・餌やり・撮影・BBQ）の初期データ
- Row Level Security（RLSは全テーブルで有効。個人情報を含むテーブルはサーバー側のservice-role経由でのみ読み書きし、`reviews`の公開済みレコードのみ匿名読み取りを許可）
- 新規ユーザー作成時に自動で `profiles` 行を作る仕組み（0002適用後は `customer` がデフォルト）
- アバター画像用の `avatars` Storageバケットとアクセスポリシー（本人フォルダにのみ書き込み可、読み取りは公開）
- `bookings.user_id`（ログイン中に予約すると自動的に紐づく。ゲスト予約時は null のまま）

料金や体験内容を変更したい場合は、SQL Editorで `site_types` / `experience_options` / `site_settings` テーブルを直接編集してください（将来的に管理画面から編集できるようにする場合はここを拡張します）。

## 3. 管理者アカウントの作成

管理者アカウントは公開の新規登録フォーム（`/signup`）からは作成できません（`/signup` は常に `customer` 権限になります）。作成方法は2通りです。

**方法A: 付属のシードスクリプト（すでに実行済み）**

```bash
node scripts/seed-admin.mjs
# または
npm run seed:admin
```

`admin@gmail.com` / パスワード `admin@gmail.com` で管理者アカウントを作成済みです。`/admin/login` からログインできます。本番運用する場合はログイン後にパスワードを変更してください。

**方法B: 管理画面から追加**

一度管理者でログインすれば、`/admin/users` → 「ユーザーを追加」から、権限（管理者／スタッフ／顧客）を指定して新しいアカウントを作成できます。

## 4. 開発サーバー

```bash
npm run dev
```

- 公式サイト: http://localhost:3000
- 予約フォーム: http://localhost:3000/booking
- 会員登録・ログイン: http://localhost:3000/signup ／ http://localhost:3000/login
- マイページ（要ログイン）: http://localhost:3000/mypage
- 管理画面: http://localhost:3000/admin/login

## 5. 会員アカウント・アバターについて

- ゲストはログインなしで予約できます（従来通り）。ログイン中に予約すると、その予約が自動的にアカウントに紐づき、`/mypage` の予約履歴に表示されます。
- アバター画像はブラウザから直接Supabase Storageの `avatars` バケットへアップロードされます（`<ユーザーID>/` 配下のみ書き込み可）。5MBまで、画像ファイルのみ。
- 権限は3種類: `admin`（全機能）／`staff`（管理画面アクセス、想定は今後の運用拡張用）／`customer`（マイページのみ）。権限は `profiles.role` で管理し、`/admin/users` から変更できます。
- セキュリティ上のポイント: 権限昇格はブラウザから直接操作できない `app_metadata`（service-roleのみ書き込み可）経由か、管理画面のユーザー編集（service-role使用のAPI経由）でのみ行われます。公開の `/signup` フォームで自分の権限を上げることはできません。

## 6. 画像について

サイト内の写真はすべて **プレースホルダー**（`ImagePlaceholder` コンポーネント）です。実際の写真を用意したら、各ページで `ImagePlaceholder` を `next/image` の `<Image>` に置き換えてください。プレースホルダーには「何の写真が必要か」「参考サイト（horserest.jp / bajigaku.net など）」が明記されているので、撮影・選定の指示書としてそのまま使えます。

## 7. 満足度アンケートの自動送信について

- 予約を **承認** すると、そのアンケート用トークンが自動発行されます（`surveys`テーブル）。
- 管理画面の予約詳細ページから「アンケートを送信」ボタンで手動送信できます。
- 完全自動化（チェックアウト翌日に自動送信）するには `/api/cron/send-surveys` を毎日1回叩くスケジューラが必要です。Vercelにデプロイする場合は `vercel.json` にcron設定を同梱済みです（毎日22:00 UTC実行）。`CRON_SECRET` を環境変数に設定すると、そのシークレットを知らない第三者からの実行を防げます。
- Vercel以外（他ホスティング / セルフホスト）の場合は、外部のcronサービス（cron-job.org等）や Supabase の pg_cron から `GET /api/cron/send-surveys?secret=...` を1日1回呼び出してください。

## 8. AIによる自由記述の分類について

アンケートの自由記述は `src/lib/survey-analysis.ts` のキーワードマッチングで自動タグ付け（ポニー／BBQ／スタッフ対応／価格料金など）しています。外部LLM APIキーなしで動く簡易版です。将来的に要約精度を上げたい場合は、この関数の中身をClaude API等の呼び出しに差し替えるだけで、呼び出し側（`/api/survey/[token]/route.ts`）は変更不要です。

## 9. 今後の拡張ポイント（設計上、対応しやすい形にしています）

- 複数施設対応: `site_types` は施設IDを持たせて拡張可能な形にしてあります
- 決済機能: 予約は「申込→承認」の2段階のため、承認時にオンライン決済を挟む拡張がしやすい構成です
- LINE通知・多言語対応・AIチャットボット: 現状は素のNext.js構成のため、必要になったタイミングで追加してください
- 行政向けレポート: `/admin/reports` にCSVエクスポートを実装済み。PDF化が必要になれば同じ集計ロジック（`src/lib/admin-stats.ts`）を再利用できます

## ディレクトリ構成の要点

```
src/app/                 公開ページ（施設コンセプト・体験・料金など）+ /booking, /survey, /login, /signup, /mypage
src/app/admin/(auth)/    管理者ログイン（共通レイアウトなし）
src/app/admin/(dashboard)/  管理ダッシュボード一式（予約・カレンダー・アンケート・口コミ・レポート・ユーザー管理）
src/app/api/             予約・お問い合わせ・アンケート・アカウント・管理者操作・cron の各エンドポイント
src/lib/supabase/        client.ts(ブラウザ) / server.ts(RLS適用) / admin.ts(service-role・サーバー専用)
src/lib/booking.ts       予約の空き状況・料金計算・DB読み書きの共通ロジック
src/lib/account.ts       ログイン中ユーザーのプロフィール・予約履歴取得
src/lib/admin-users.ts   管理画面のユーザー一覧取得
src/types/database.ts    DBスキーマに対応する型定義（手書き。スキーマ変更時は要更新）
src/proxy.ts             認証ガード（/admin は role=admin|staff 必須、/mypage はログインのみ必須）
supabase/migrations/     SQLマイグレーション（0001が本体、0002が会員機能・アバター）
scripts/seed-admin.mjs   管理者アカウントのシード（`npm run seed:admin`）
```
