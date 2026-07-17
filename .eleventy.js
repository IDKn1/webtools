module.exports = async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/static/": "/tools/" });

  eleventyConfig.addFilter("brightness", (code) => {
    const red = parseInt(code.slice(0, 2), 16);
    const green = parseInt(code.slice(2, 4), 16);
    const blue = parseInt(code.slice(4, 6), 16);
    const avg = red * 0.299 + green * 0.587 + blue * 0.114;
    return avg > 186 ? "black" : "white";
  });

  const { HtmlBasePlugin } = await import("@11ty/eleventy");

	eleventyConfig.addPlugin(HtmlBasePlugin);

  return {
    pathPrefix: "/tools/",
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes", // relative to input
    },

    templateFormats: ["liquid", "html"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
