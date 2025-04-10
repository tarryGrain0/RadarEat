# アプリ名：Tabenabi

## 証明証の発行
> mkdir -p nginx/ssl
mkcert -key-file nginx/ssl/key.pem -cert-file nginx/ssl/cert.pem localhost

## 機能要件
**検索入力画面**
- 検索キーワード入力
- カテゴリ選択（和食 / 洋食 / 中華 / ラーメンなど）
- 予算フィルター
- 検索ボタン
- 徒歩時間フィルタ
- 距離フィルタ

**結果表示画面**
- ページング
- 表示ソート
- 