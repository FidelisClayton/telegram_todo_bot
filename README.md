# telegram_todo_bot
Simple telegram TODO bot.

# Install

## 1 - Install dependencies

```
> npm install
```

## 2 - Setup your mongodb URI

```javascript
// index.js

require('./app/config/mongodb.js')('YOUR_DATABASE_HERE');
```

## 3 - Setup your Telegram bot token
```javascript
// app/bots/TodoBot.js


const token = 'YOUR_TELEGRAM_TOKEN';
```

## 4 - Init
```

npm start

```

## 5 - Test on Telegram
