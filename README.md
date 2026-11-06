# 茲奇製研所｜互動式完整網站 v2.0

這是可直接開啟、可獨立部署至 Vercel 的 **HTML／CSS／JavaScript 靜態網站**，無須 Next.js、Tailwind、npm 或額外 JavaScript 套件。主要參考 .fubá 的動態敘事精神，重新創作為茲奇製研所的紫橘設計語言；**未複製原站程式碼或獨有圖像**。

## 網站內容

| 路徑 | 頁面 |
|---|---|
| `index.html` | 公司首頁：品牌主視覺、理念、三幕式滾動敘事、六件作品、設計流程、FOCITO、動態與聯絡 |
| `projects/stellarvision.html` | StellarVision 作品內頁 |
| `projects/renew-harvest.html` | Renew Harvest Pack 作品內頁 |
| `projects/wormy-planty.html` | Wormy Planty 作品內頁 |
| `projects/www.html` | WWW 作品內頁 |
| `projects/envirotrack.html` | EnviroTrack Card 作品內頁 |
| `projects/medpass.html` | MEDPASS 作品內頁 |
| `shop.html` | FOCITO 商店與品牌展示頁（尚未接真正購物功能） |

## 真正寫好的互動

1. **滾動敘事**：中段 Ask → Experiment → Make Real 三幕式橫向推進；手機改為直式逐段閱讀。
2. **滑鼠互動**：品牌幾何物件視差、按鈕輕量磁吸、研究卡片的 3D 傾斜。
3. **作品互動**：依領域篩選六件作品、桌面游標附近浮動作品圖片預覽。
4. **跨頁轉場**：內部頁面點擊時，橘色品牌幕簾轉場。
5. **細部動畫**：捲動進場、跑馬字幕、形狀持續變形、閱讀進度條。
6. **無障礙降級**：支援 `prefers-reduced-motion`，手機隱藏自訂游標，導覽有鍵盤焦點與 Esc 關閉功能。

## 如何在電腦看

解壓縮後，直接在 Chrome 或 Safari 開啟根目錄的 `index.html`。請**保留** `assets/` 與 `projects/` 兩個資料夾，不能只上傳 `index.html`。

Google Fonts 需要網路；離線時會使用系統字型，其他 CSS/JS/圖片均在本機。

## GitHub + Vercel 部署

1. 建立新的 GitHub repository（建議先用**測試專案**，不要蓋掉原有 Next.js 正式站）。
2. 把 `index.html`、`shop.html`、`projects/`、`assets/` 全部上傳到 **repo 根目錄**。
3. Vercel → Add New → Project → 匯入該 repo。Framework Preset 選 **Other**；Build Command 不填，Output Directory 用預設根目錄。
4. Deploy 後測試首頁、6 件作品頁、FOCITO、手機選單、作品篩選與各種動畫。
5. 確認滿意後，再決定要不要將目前官網的正式網域移到新專案。**NFC 名片專案與公司官網是不同專案**，不需要混在一起。

## 可以去哪裡修改

- 顏色：`assets/interactive.css` 最上方的 `:root`（品牌紫 `#6F22C8`、橘 `#FF4800`）。
- 網站動畫、篩選：`assets/interactive.js`。
- 首頁文案與版面：`index.html`。
- 作品文字：各 `projects/*.html`。
- Logo／作品圖：`assets/` 內同名檔案。圖檔若改名，需同步更新 HTML 引用。
- 商店文案：`shop.html`。

## 素材與真實性聲明

- `assets/tsuki-mark.png`：以既有茲奇 LOGO 資產作為導覽標誌。
- `assets/stellarvision.jpg`：先前提供的 StellarVision 實際作品照片。
- 其他五件作品的 PNG 與 `focito-scene.png`：**網站示意視覺**，不是已確認的正式作品照／IP 圖稿。正式公開前請替換。
- StellarVision 是非螢幕兒童視覺互動教具；未加入不存在的 App、硬體螢幕、眼動追蹤或醫療療效宣稱。
- 內容以目前已知的設計概念撰寫；正式發表前仍應由公司核對每件作品的技術、材料、成果與合作資訊。
- `shop.html` **沒有**購物車、資料庫、金流、訂單或庫存；不可當作已上線的購物網站，商品狀態均明確標示尚未販售。

## 驗證

- 已完成 HTML 連結與圖片本地路徑檢查（無遺失檔案）。
- 已執行 JavaScript 語法檢查與 CSS 解析檢查。
- 實際跨裝置動畫及正式站發布仍需在你自己的瀏覽器與 Vercel 網址上檢查。
