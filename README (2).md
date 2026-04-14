# CAR DREAM 買取実績LP

車買取専門 CAR DREAM（カードリーム）の「買取実績」ランディングページです。  
Netlifyへそのままドロップしてデプロイできる静的サイト構成です。

---

## 📁 ファイル構成

```
/
├── index.html              ← メインLP（全セクション）
├── netlify.toml            ← Netlify設定（ヘッダー・リダイレクト）
├── README.md               ← このファイル
└── assets/
    ├── css/
    │   └── style.css       ← メインスタイルシート（レスポンシブ対応）
    ├── js/
    │   └── main.js         ← インタラクション全般
    └── images/
        ├── car01.jpg       ← ランドクルーザーバン70
        ├── car02.jpg       ← ヤリスクロスハイブリッド
        ├── car03.jpg       ← ハイエースバン
        ├── car04.jpg       ← ノア
        ├── car05.jpg       ← ルーミー
        ├── car06.jpg       ← セルシオ
        ├── car07.jpg       ← ハスラー
        ├── car08.jpg       ← BMW1シリーズ
        └── car09.jpg       ← キューブ
```

---

## 🚀 Netlifyへのデプロイ方法

### 方法①：ドラッグ＆ドロップ（最も簡単）

1. このフォルダ（`/` ルートまたは ZIP）全体を用意する
2. [https://app.netlify.com/drop](https://app.netlify.com/drop) を開く
3. フォルダごと画面中央にドラッグ＆ドロップ
4. 数秒でデプロイ完了 → URLが発行されます

### 方法②：GitHubと連携（推奨・更新が楽）

1. このフォルダをGitHubリポジトリにプッシュ
2. [https://app.netlify.com](https://app.netlify.com) でアカウント作成 or ログイン
3. `Add new site` → `Import an existing project` → GitHub連携
4. リポジトリを選択
5. Build設定：
   - **Build command**: （空欄のまま）
   - **Publish directory**: `.`（ドット、ルートを指定）
6. `Deploy site` をクリック

---

## 📋 デプロイ前チェックリスト

### 必須対応

- [ ] `assets/images/` に車両画像（car01.jpg〜car09.jpg）を配置
  - 画像がない場合はフォールバックアイコンが表示されます（動作は問題なし）
- [ ] LINE公式アカウントのURLを差し替え
  - 現在: `https://www.instagram.com/llc.cardream/`（Instagramで代替）
  - 変更箇所: `index.html` 内の `btn-line` クラスのリンク
- [ ] 電話番号の追加
  - ヘッダー・固定CTAに電話番号を追加することを推奨
- [ ] 古物商許可番号の記載（会社情報セクション）

### 推奨対応

- [ ] フォーム送信先の設定（下記参照）
- [ ] Google Analytics / GTMの設置
- [ ] OGP画像の設定（SNSシェア時のサムネイル）
- [ ] ファビコンの設置（`favicon.ico` をルートに配置）

---

## 📬 フォーム送信の設定

### Netlify Formsを使う場合（無料）

`index.html` の `<form>` タグを以下に変更：

```html
<form class="estimate-form" id="estimate-form" name="estimate" method="POST" data-netlify="true" novalidate>
  <input type="hidden" name="form-name" value="estimate">
  <!-- 残りのフィールドはそのまま -->
</form>
```

`assets/js/main.js` の `handleFormSubmit` 関数を以下に変更：

```javascript
function handleFormSubmit(form) {
  const btn = document.getElementById('submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 送信中...';
  }

  // Netlify Formsへ送信
  const formData = new FormData(form);
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData).toString(),
  })
  .then(() => {
    form.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  })
  .catch(err => {
    console.error(err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 無料査定を申し込む';
    }
  });
}
```

### Formspreeを使う場合

1. [https://formspree.io](https://formspree.io) でアカウント作成
2. フォームを作成してエンドポイントURL（例：`https://formspree.io/f/XXXXXXXX`）を取得
3. `handleFormSubmit` 内の `fetch` 先URLを変更

---

## 🎨 カスタマイズ方法

### 買取実績カードの追加・変更

`index.html` 内の `<!-- Results grid -->` セクションにある `<article class="result-card">` を複製・編集してください。

```html
<!-- フィルタ用カテゴリ: toyota / nissan / suzuki / bmw / over100 / highkm -->
<article class="result-card fade-in" data-category="toyota over100">
  <div class="rc-badge">高額買取</div>
  <div class="rc-img-wrap">
    <img src="assets/images/carXX.jpg" alt="車種名 買取実績" loading="lazy">
    <div class="rc-img-fallback"><i class="fa-solid fa-car"></i></div>
  </div>
  <div class="rc-body">
    <div class="rc-tags">
      <span class="tag tag-maker">メーカー名</span>
      <span class="tag tag-type">ボディタイプ</span>
    </div>
    <h3 class="rc-model">車種名</h3>
    <ul class="rc-specs">
      <li><i class="fa-solid fa-calendar"></i> 年式</li>
      <li><i class="fa-solid fa-gauge"></i> 走行距離</li>
      <li><i class="fa-solid fa-location-dot"></i> 地域</li>
    </ul>
    <div class="rc-price-block">
      <p class="rc-price-label">買取価格</p>
      <p class="rc-price">1,000,000<span>円</span></p>
    </div>
    <p class="rc-reason">
      <i class="fa-solid fa-lightbulb"></i>
      査定ポイントの説明文
    </p>
  </div>
  <a href="#contact" class="rc-cta-btn">同じような車を査定依頼する</a>
</article>
```

### カラーテーマの変更

`assets/css/style.css` の `:root` セクションを編集：

```css
:root {
  --red: #d40000;          /* メインカラー（赤） */
  --red-dark: #a80000;     /* ホバー時の濃い赤 */
  --orange: #ff6b00;       /* アクセントカラー */
  /* ... */
}
```

---

## 📊 ページ構成

| セクション | ID | 概要 |
|---|---|---|
| ヒーロー | `#hero` | キャッチコピー・実績プレビュー・CTA |
| 買取実績一覧 | `#results` | フィルター付き9件の実績カード |
| 選ばれる理由 | `#reasons` | 高価買取の理由・比較表 |
| お客様の声 | `#testimonials` | 3件の口コミ |
| 査定の流れ | `#flow` | 4ステップフロー |
| よくある質問 | `#faq` | アコーディオンFAQ 7問 |
| 無料査定フォーム | `#contact` | バリデーション付きフォーム |

---

## 🛠 使用技術・ライブラリ

| ライブラリ | バージョン | 用途 |
|---|---|---|
| Google Fonts (Noto Sans JP / Oswald) | – | フォント |
| Font Awesome | 6.5.0 (CDN) | アイコン |
| Vanilla JS (ES6+) | – | インタラクション全般 |

外部依存はCDN経由のFont Awesome・Google Fontsのみ。  
フレームワーク不使用のため、表示が軽量・高速です。

---

## 📝 実装済み機能

- [x] レスポンシブデザイン（スマホ / タブレット / PC）
- [x] スクロールアニメーション（フェードイン）
- [x] 統計数字カウントアップ
- [x] 買取実績フィルタリング（メーカー別・価格帯・走行距離）
- [x] FAQアコーディオン
- [x] フォームバリデーション
- [x] 固定CTA（スクロール後に下部に表示）
- [x] ハンバーガーメニュー（スマホ）
- [x] 画像エラー時のフォールバック表示
- [x] スムーズスクロール
- [x] Netlifyキャッシュ・セキュリティヘッダー設定

---

## 🔜 推奨する次のステップ

1. **車両画像の配置** - car01.jpg〜car09.jpg を assets/images/ へ
2. **Netlify Formsの有効化** - フォーム送信を実際に受け取れるように
3. **Google Analytics / GTM設置** - CV計測・広告最適化のため
4. **電話番号の追加** - ヘッダーCTAへ追加
5. **口コミ・実績件数の拡充** - 20件以上を目標に
6. **OGP設定** - X（旧Twitter）・Facebook・LINEでのシェア対策
7. **車種別LP制作** - 事故車LP・過走行LP・地域別LPの追加

---

&copy; 2025 CAR DREAM All Rights Reserved.
