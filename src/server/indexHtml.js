var pkg = require("../../package.json");

module.exports = function (staticsDirectory) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${pkg.title}</title>
<link rel="stylesheet" href="${staticsDirectory}/app.css">
</head>
<body>
<app></app>
<script src="${staticsDirectory}/app.js"></script>
</body>
</html>`;
};
