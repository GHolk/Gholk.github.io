<?xml version="1.0"
      encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <html>
      <head>
        <title> <xsl:value-of select="feed/title" /> </title>
      </head>
      <body>
        <xsl:for-each select="feed">
          <xsl:apply-templates />
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="entry">
    <article>
      <h2><xsl:value-of select="title" /></h2>
      <p><xsl:value-of select="summary" /></p>
    </article>
  </xsl:template>

</xsl:stylesheet>
