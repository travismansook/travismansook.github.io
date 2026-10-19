# Publish Travis's portfolio with GitHub Pages

**Yes—GitHub Pages is a good fit for this portfolio.** It hosts the site's HTML, CSS, JavaScript, and images for free from a public repository. You can start with a free GitHub address and add your own domain later. [GitHub's setup guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

Your intended address is **[travismansook.github.io](https://travismansook.github.io)**. The address will work after you finish setup.

## 1. Unzip and preview your portfolio

Download `portfolio-website.zip` and unzip it. Open the extracted folder, then double-click `index.html` to preview the site in your browser.

The website files are:

```text
index.html
styles.css
script.js
demos.css
demos.js
assets/
.nojekyll
README.md
```

Keep the `assets` folder beside `index.html`. You don't need to install any software or run commands.

## 2. Create your website repository

1. Sign in to [GitHub](https://github.com).
2. Click **+** near the upper right, then **New repository**.
3. Set the owner to **travismansook**.
4. Enter the exact repository name **travismansook.github.io**.
5. Choose **Public** and turn **Add README** on.
6. Click **Create repository**.

If that repository already exists, open it and use it. GitHub requires this naming pattern for a personal site at your account's main GitHub Pages address. [Repository setup documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## 3. Upload the website files

1. In the repository's **Code** tab, choose **Add file → Upload files**.
2. Open the unzipped portfolio folder on your computer.
3. Drag its **contents** into GitHub's upload area, including the `assets` folder.
4. Enter a short message such as **Add portfolio website**.
5. Click **Commit changes** to save the upload.

Upload the files and folder, **not the ZIP or its enclosing portfolio folder**. You should see `index.html` immediately when opening the repository.

The `.nojekyll` file may be hidden on your computer. It is included to keep publishing simple; this portfolio's ordinary filenames also work without it. To include it manually, choose **Add file → Create new file**, name it `.nojekyll`, leave it empty, and commit it.

## 4. Turn on GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/(root)**.
4. Click **Save**.

These are GitHub's [branch publishing settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Allow up to 10 minutes, then return to **Settings → Pages** and click **Visit site**. Your website should be at [travismansook.github.io](https://travismansook.github.io). [Publishing timing](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## Updates and quick fixes

- **Change your portfolio:** edit the downloaded files, preview `index.html`, then upload the changed files to the same location. Saving changes to `main` automatically republishes the site. [Automatic publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- **404 page:** confirm the exact repository name, the publishing settings, and that `index.html` is at the top level.
- **Missing styling or images:** keep filenames unchanged and upload `styles.css`, `script.js`, `demos.css`, `demos.js`, and the entire `assets` folder.
- **Deployment error:** open the repository's **Actions** tab to inspect the latest Pages run. [Deployment troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

Your portfolio is ready to share once the published page loads correctly.
