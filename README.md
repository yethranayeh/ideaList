<!-- @format -->

# **ideaList**

Welcome to **ideaList** repo! 🙋‍♂️

![cover](https://i.ibb.co/3sSmtdx/cover.png)

**ideaList** is my to-do list project for The Odin Project [Todo List assignment](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/todo-list). The application is designed with a _mobile first approach_, so there may be visual discrepancies on larger screens, which will be updated in due time.

## Technologies Used

- `pubsub-js`
- `date-fns`
- `Flatpickr`
- `webpack`

## Features

1. 📱 Progressive Web Application: **ideaList** is designed primarily for mobile devices,
   - It can be installed to the home page of your device like a native application downloaded from the store.
   - In addition, once the app is installed to the home screen, it can be used _without_ any internet connection.
2. Each to-do can have details like description, additional notes and tags, which can be revealed with the `Details` button on each to-do
   - Since there is currently no confirmation prompts, the `delete` buttons for each to-do are also hidden in detailed view to prevent accidental deletion.
3. The application has a detailed filtering system that can deliver to-do items based on both general and very specific filter combinations.

## App Limitations

- Max amount of tags that can be selected for a Todo is 3.
- Max character length for a new tag is 16.

## Possible Feature Additions

_These features may or may not be implemented in the future versions of the app._

- Checklists for todos
- Sorting by date/priority/alphabetical order.

## Known Issues

1. Though no earlier days before `today` are allowed in due dates, it is possible to create a to-do at an hour that has _already_ passed.
2. Once the `Flatpickr` is instantiated on New Todo form, the calendar language will be unaffected by live language switches. Though `Flatpickr` provides a `redraw()` method, this unfortunately does not rewrite month names in the switched local language.
   > A possible solution might be to `destroy()` the current instance and replace it with another that has the active locale language.

## Credits

- App Brand:
  - Font - [Quicksand-Regular](https://www.fontsquirrel.com/fonts/quicksand) by [Andrew Paglinawan](http://andrewpaglinawan.com/)
  - Icon - _Tick_ by [Kenneth Chua](https://thenounproject.com/inkentation/) from [NounProject.com](https://thenounproject.com/)
- Font Awesome [license](https://fontawesome.com/license)
- Hamburger Menu by [ainalem](https://codepen.io/ainalem/pen/LJYRxz)
- Search Button by [ShortCode](https://codepen.io/ShortCode/pen/jOrBeOw)
- i18n:
  - JavaScript code snippets from [Mohammad Ashour](https://phrase.com/blog/posts/author/mohammad-ashour/)'s article.
  - CSS code for the language switcher by [magnificode](https://codepen.io/magnificode/)
- Todo Filtering:
  - Code snippet for checking if arrays are equal by [enyo](https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript/16436975#16436975)
- Todo Create Form:
  - _pseudo-table_ trick by [hennson](https://coderwall.com/p/8bg0wa/css-only-highlight-label-when-focusing-an-input-field) to visually place `label` above `input` while allowing CSS sibling selectors to work behind the scenes.
  - Input field character length limiting code snippet by [will](https://stackoverflow.com/a/10656599)
- Todo Display:
  - Todo completion checkbox code snippet by [aaroniker](https://codepen.io/aaroniker)
- PWA:
  - Article by [sheshanth](https://dev.to/sheshanth/make-web-application-installable-1709) to make the App installable.
