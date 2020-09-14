const path = require("path");
const paths = require("./paths");
const pug = require("pug");
const nunjucks = require("nunjucks");
const projectVars = require("../src/11ty/_data/project");
const pluginPWA = require("eleventy-plugin-pwa");
require("dotenv").config('./.env');
const cleanCSS = require("clean-css");
const fs = require("fs");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const localImages = require("eleventy-plugin-local-images");
const lazyImages = require("eleventy-plugin-lazyimages");
const ghostContentAPI = require("@tryghost/content-api");
const Handlebars = require("handlebars");
const htmlMinTransform = require("./transforms/html-min-transform.js");
const url = "";
const sass = require('./sass-process');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
//Watching for modificaions in style directory
/*sass('src/preprocess/neu.scss', 'dist/assets/css/neu.css');*/
sass('src/assets/components/base/base.scss', 'dist/assets/css/base.css');
const outputDir = 'dist';
const assetDir = 'assets';
// Init Ghost API
const api = new ghostContentAPI({
    url: process.env.GHOST_API_URL,
    key: process.env.GHOST_CONTENT_API_KEY,
    version: "v2"
});

// Strip Ghost domain from urls
const stripDomain = url => {
    return url.replace(process.env.GHOST_API_URL, "");
};


module.exports = function(config) {
    config.setLibrary("pug", pug);


    // Apply performance attributes to images
    //config.addPlugin(lazyImages, {
   //     cacheFile: ""
   // });

    // Minify HTML
    config.addTransform("htmlmin", htmlMinTransform);

    // Assist RSS feed template
    config.addPlugin(pluginRSS);
    config.addLayoutAlias('author', 'author.njk');
    config.addLayoutAlias('post', 'post.njk');
    config.addLayoutAlias('tag', 'tag.njk');
    config.addLayoutAlias('base', 'default.pug');
    config.addLayoutAlias('hometel', 'index.pug');


    config.addLayoutAlias('posts', './src/11ty/_includes/layouts/doc.njk');
    config.addLayoutAlias('tags', './src/11ty/_includes/layouts/tag.njk');
    config.addLayoutAlias('docs', './src/11ty/_includes/layouts/doc.njk');
    // Copy images over from Ghost
    config.addPlugin(localImages, {
        distPath: "dist",
        assetPath: "/content/images",
        selector: "img",
        attribute: "data-src",
        verbose: true
    });

      
   
    config.addFilter('assetPath', function(value) {
        if (process.env.ELEVENTY_ENV === 'production') {
            const manifestPath = path.resolve(
                __dirname,
                outputDir,
                assetDir,
                'manifest.json'
            );
            const manifest = JSON.parse(fs.readFileSync(manifestPath));
            return `/${assetDir}/${manifest[value]}`;
        }
        return `/${assetDir}/${value}`;
    });


    // Inline CSS
    config.addFilter("cssmin", code => {
        return new cleanCSS({}).minify(code).styles;
    });

    config.addFilter("getReadingTime", text => {
        const wordsPerMinute = 200;
        const numberOfWords = text.split(/\s/g).length;
        return Math.ceil(numberOfWords / wordsPerMinute);
    });

    // Date formatting filter
    config.addFilter("htmlDateString", dateObj => {
        return dateObj;
    });

    // Don't ignore the same files ignored in the git repo
    config.setUseGitIgnore(false);

    // Get all pages, called 'docs' to prevent
    // conflicting the eleventy page object
    config.addCollection("docs", async function(collection) {
        collection = await api.pages
            .browse({
                include: "authors",
                limit: "all"
            })
            .catch(err => {
                console.error(err);
            });

        collection.map(doc => {
            doc.url = stripDomain(doc.url);
            doc.primary_author.url = stripDomain(doc.primary_author.url);

            // Convert publish date into a Date object
            doc.published_at = new Date(doc.published_at);
            return doc;
        });

        return collection;
    });

    // Get all posts
    config.addCollection("posts", async function(collection) {
        collection = await api.posts
            .browse({
                include: "tags,authors,feature_image",
                limit: "all"
            })
            .catch(err => {
                console.error(err);
            });

        collection.forEach(post => {
            post.url = stripDomain(post.url);
            if (post.feature_image != null){
            post.feature_image = stripDomain(post.feature_image);}
            post.primary_author.url = stripDomain(post.primary_author.url);
            post.tags.map(tag => (tag.url = stripDomain(tag.url)));

            // Convert publish date into a Date object
            post.published_at = new Date(post.published_at);
        });

        // Bring featured post to the top of the list
        collection.sort((post, nextPost) => nextPost.featured - post.featured);

        return collection;
    });

    // Get all authors
    config.addCollection("authors", async function(collection) {
        collection = await api.authors
            .browse({
                limit: "all"
            })
            .catch(err => {
                console.error(err);
            });

        // Get all posts with their authors attached
        const posts = await api.posts
            .browse({
                include: "authors",
                limit: "all"
            })
            .catch(err => {
                console.error(err);
            });

        // Attach posts to their respective authors
        collection.forEach(async author => {
            const authorsPosts = posts.filter(post => {
                post.url = stripDomain(post.url);
                return post.primary_author.id === author.id;
            });
            if (authorsPosts.length) author.posts = authorsPosts;

            author.url = stripDomain(author.url);
        });

        return collection;
    });

    // Get all tags
    config.addCollection("tags", async function(collection) {
        collection = await api.tags
            .browse({
                include: "count.posts",
                limit: "all"
            })
            .catch(err => {
                console.error(err);
            });

        // Get all posts with their tags attached
        const posts = await api.posts
            .browse({
                include: "tags,authors",
                limit: "all"
            })
            .catch(err => {
                console.error(err);
            });

        // Attach posts to their respective tags
        collection.forEach(async tag => {
            const taggedPosts = posts.filter(post => {
                post.url = stripDomain(post.url);
                return post.primary_tag && post.primary_tag.slug === tag.slug;
            });
            if (taggedPosts.length) tag.posts = taggedPosts;

            tag.url = stripDomain(tag.url);
        });

        return collection;
    });

    // minify the html output when running in prod
    if (projectVars.production) {
        config.addPlugin(pluginPWA);
        config.addTransform(
            "htmlmin",
            require("../build/scripts/minify-html")
        );
    }

    // Copy `src/static/` to `dist/`
    config.addPassthroughCopy({ "src/static": "static" });
    config.addPassthroughCopy({ "src/assets/components": "assets/components" });
    config.addPassthroughCopy({ "src/media": "media" });
    config.addPassthroughCopy({ "src/assets": "assets" });


    return {
        dir: {
            input: "./src",
            output: "dist",
            includes: "11ty/_includes",
            data: "../_data",
            partials: "partials",
            layouts: "11ty/_includes/layouts"
        },
        // Files read by Eleventy, add as needed
        templateFormats: ["njk", "md", "txt", "hbs", "pug", "css", "png", "svg", "jpg", "js", "webp"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true
    };
};