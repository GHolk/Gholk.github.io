# 中控室值班鬧鐘
用 service worker 和 push api 試做鬧鐘。

<script src="service-worker.js"></script>

<form method="post" action="alerm/new" target="hidden-frame">
  <input type="datetime" name="date">
  <input name="title">
  <textarea name="body"></textarea>
  <input type="submit">
</form>

<iframe name="hidden-frame"></iframe>

