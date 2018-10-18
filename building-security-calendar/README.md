# 中控室值班鬧鐘
用 service worker 和 push api 試做鬧鐘。

<script src="service-worker.js"></script>

<form method="post" action="alerm/new" target="hidden-frame">
<label>
日期：
<input type="datetime" name="date">
</label>
<label>
標題： <input name="title">
</label>
<label>
內文：<textarea name="body"></textarea>
</label>
<input type="submit">
</form>

<iframe name="hidden-frame"></iframe>

<style>
label {
display: block;
}
</style>
