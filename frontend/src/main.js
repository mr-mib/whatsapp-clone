import "./style.css";
import { renderApp } from "./views/app.js";
import { requestNotificationPermission } from "./notifications.js";

renderApp();
requestNotificationPermission();
