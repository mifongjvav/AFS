<p align="center">
  <img width="500" alt="osu! logo" src="/AFS.png">
</p>

# Argon Function Station

![GitHub last commit](https://img.shields.io/github/last-commit/mifongjvav/AFS?display_timestamp=committer) ![GitHub Repo stars](https://img.shields.io/github/stars/mifongjvav/AFS) ![GitHub forks](https://img.shields.io/github/forks/mifongjvav/AFS) ![GitHub License](https://img.shields.io/github/license/mifongjvav/AFS)

一个普普通通的站点。寻找需要的函数没那么麻烦！

## 状态

该项目持续收录各种函数中，包括但不限于Kitten N（主为Kitten N）。

截至2025年10月30日 21点27分，AFS已经收录8个函数。

## 访问

|AFS总站|
|--|
|<https://argon-fs.pages.dev/>|

## 提交函数

### 通过作者

如果你什么都不会，加QQ

|172013661|
|--|

作者帮你提交。

### 通过提交拉取请求

### 先决条件

请确保您满足以下先决条件：

- 拥有一个Github账户。

在处理存储库时，我们建议使用具有智能代码补全和语法高亮的 IDE，例如最新版本的Visual Studio Code。

### 下载源代码

克隆AFS存储库：

```shell
git clone https://github.com/mifongjvav/AFS
cd AFS
```

要在 `AFS` 目录中将源代码更新到最新提交，请运行以下命令：

```shell
git pull
```

### 开发

启动你的 IDE。

打开 `AFS` 目录中的 `AFS.json`

转到最后一行之上，粘贴这个模板：

```json
{
  "title": "标题",
  "icon": "fas fa-file",
  "description": "<p>原作者：你的名字</p><p>描述</p>",
  "link": "https://kn.codemao.cn/view/?workId=252508272",
  "linkText": "获取函数",
  "target": "_blank"
  }
```

> [!NOTE]
> 你应该在最后一个`}`那插入一个英文的`,`（注意不是中文的`，`）来保证格式正确。
> 键`icon`的值可以在[Font Awesome 图标页面](https://fontawesome.com/search?f=classic&s=solid&o=r)来查找。
> 点击一个适合的图标，点击右边的html，粘贴到键`icon`值的输入位置，删除没用内容直到只有`fa-solid fa-图标名称`，把`fa-solid`替换为`fas`。

### 代码审查

在提交代码之前，请右键点击`格式化文档`。

## 贡献

在为项目做贡献方面，你可以做的两件主要事情来提供帮助的是报告函数的问题和提交函数。

如果你有任何问题，在做之前，请随时联系 Argon。

## 许可证

AFS 提供的的函数默认根据 MIT 许可证进行许可。更多信息请参阅许可证文件 。[tl;dr](https://tldrlegal.com/license/mit-license) 只要在任何作品/源代码的副本中包含原始版权和许可证声明，你可以做任何你想做的事情。

如果你的函数需要使用其它许可证进行开源，请在简介标明。
