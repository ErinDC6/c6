if [ "$NODE_ENV" = "production" ]; then
  npm run build;
  npm start;
  exit;
fi

if [ "$NODE_ENV" = "development" ]; then
  npm run develop;
  exit;
fi

echo "Please provide either 'ENV=development' or 'ENV=production'"
exit 1;