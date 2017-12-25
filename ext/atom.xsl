<?xml version="1.0"
      encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
  <xsl:output method="html"
              encoding="UTF-8"
              indent="yes" />

  <xsl:template match="/feed">
    <html lang="zh-TW" prefix="og: http://ogp.me/ns#">
      <head>
        <meta http-equiv="Content-Type"
              content="text/html; charset=UTF-8" />
        <meta charset="UTF-8" />
        <meta name="author"
              property="og:article:author"
              content="gholk" />
        <meta name="copyright"
              content="Common Creative" />
        <!-- 以上一般不用改，以下才要改。 -->

        <!-- 後設資料 -->
        <meta name="date"
              property="og:article:public_time"
              content="2017-12-25" />

        <!-- 和網頁位置有關 -->
        <link rel="icon"
              type="image/png">
          <xsl:attribute name="href">
            <xsl:value-of select="icon" />
          </xsl:attribute>
        </link>
        <link rel="stylesheet"
              type="text/css"
              href="ext/list.css" />
        <link rel="alternate" type="text/html">
          <xsl:attribute name="href">
            <xsl:value-of select="link[@rel='alternate'][@type='text/html']/@href" />
          </xsl:attribute>
        </link>
        <script src="ext/meta-bloging.js"></script>
        <title> <xsl:value-of select="title" /> </title>
      </head>
      <body>
        <h1> <xsl:value-of select="title" /> </h1>
        <small class="date"> <xsl:value-of select="updated|published" /> </small>
        <p> <xsl:value-of select="subtitle" /> </p>
        <main>
          <xsl:apply-templates select="entry" />
        </main>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="entry">
    <hr />
    <article>
      <h2>
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="link[@rel='alternate'][@type='text/html']/@href" />
          </xsl:attribute>
          <xsl:value-of select="title" />
        </a>
      </h2>
      <small class="date">
        <xsl:value-of select="published" />
      </small>
      <p> <xsl:value-of select="summary" /> </p>
      <ul class="tag-list">
        <xsl:for-each select="category">
          <li> <xsl:value-of select="@term" /> </li>
        </xsl:for-each>
      </ul>
    </article>
  </xsl:template>

</xsl:stylesheet>
