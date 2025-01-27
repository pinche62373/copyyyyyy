# app/ui

The `app/components/ui` folder is similar to `app/components` but is used for UI Kit/design system components.

In this folder go things like Button, Card, Combobox, Datepicker, etc. that:

- Are used in many many places.
- Are designed in isolation.
- Typically don't need more than client-side states.

> If Remix had support for `use client` the app/ui will be components with "use client" always
