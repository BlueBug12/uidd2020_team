git stash
git pull
git stash pop

cd client
npm i
npm run build

cd ../server
npm i
npx pm2 restart 0
