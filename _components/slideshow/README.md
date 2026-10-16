# Project slideshow

The animated project carousel from "Replacing PyTorch with Julia and Reactant: One Year In"
(it sat at the top of "What I built" until it was taken out of that post). Kept here to reuse in
future posts. Quarto does not publish directories that start with an underscore, so nothing here
appears on the site until a post copies it in.

- `slideshow.js`: mounts every `.projects` element on the page. Without JavaScript the slides
  are a row of link cards; with it they stack into one stage that advances every few seconds
  with a 3D swing, pauses on hover, focus or the pause button, and does not auto-advance under
  reduced motion.
- `slideshow.css`: its styles. Light and dark colours follow the site's theme toggle
  (`body.quarto-dark`).
- `example.html`: the original markup, with its logos in `example/`.

## Using it in a post

1. Copy `slideshow.js` into the post's `figures/` and `slideshow.css` next to `index.qmd`.
2. Add the stylesheet to the post's front matter:

   ```yaml
   format:
     html:
       css: slideshow.css
   ```

3. Add the markup where the slideshow should go, in a raw HTML block. Each slide is a link to
   the section it introduces, with its logo, a name, a one-line tag and an accent colour for
   the halo behind the logo. A logo with separate light and dark versions uses two `img`
   elements with the classes `only-light` and `only-dark`:

   ````markdown
   ```{=html}
   <div class="projects" aria-label="The projects in this post">
     <a class="project-slide" href="#my-section" style="--accent: #FF9A15">
       <img src="figures/my-logo.svg" alt="">
       <span class="project-name">MyPackage.jl</span>
       <span class="project-tag">What it does, in one line</span>
     </a>
     ...
   </div>
   <script src="figures/slideshow.js" defer></script>
   ```
   ````
