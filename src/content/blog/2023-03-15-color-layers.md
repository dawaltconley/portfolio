Documenting my process in creating

While working on this portfolio site, I wanted to try a fancy color effect in 
the page header. The idea is to have an arbitrary polygon overlay a bit of text 
and only alter the text and background color. Unless I've changed things since 
then, you can probably see it at work at the top of the page.

The most obvious approach (and the one I went with, for reasons that will 
become clear), is to just clone the content in question, adjust the text and 
background colors as desired, and crop it into the desired shape, in this case 
using the CSS `clip-path` property, which has [pretty good 
support](https://caniuse.com/css-clip-path) these days and can be animated. My 
rule of thumb, however, for accessibility and SEO purposes, is to avoid 
duplicating semantic content whenever possible. So I thought I'd try a 
different approach first, using just pseudo elements and the `mix-blend-mode` 
property.

In my simplest case, I expected to have black text on a white background, and I 
wanted text within the polygon layer to appear as white text on a colored 
background, the color of which might change. Okay, this is almost like color 
inversion right? We can achieve color inversion by adding a pseudo element to 
with the `difference` blend mode applied (or the `exclusion` blend mode, I 
admit I don't understand the difference).

```css
.text-content {
  position: relative;
  color: black;
  background-color: white;
}

.text-content::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: white.
  mix-blend-mode: difference;
  clip-path: polygon(/* whatever shape we want */);
}
```

This gives us inversion, which is what we want for the text, but not 
the background color. However, we can achieve the desired background 
color this way by placing a second pseudo element _under_ the text, 
and setting it's background color to the _complement_ of the color we 
want. So if our desired color is red (`FF0000`) we set the background 
element to aqua (`00FFFF`):

```css
.text-content::before, .text-content::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  clip-path: polygon(/* whatever shape we want */);
}

.text-content::before {
  background-color: aqua;
  z-index: -1;
}

.text-content::after {
  background-color: white.
  mix-blend-mode: difference;
}
```
