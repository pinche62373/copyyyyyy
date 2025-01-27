# compiles ts into js, then renames js to cjs
npx tsc sync/cherry-picker.ts
mv sync/cherry-picker.js sync/cherry-picker.cjs
