import "dotenv/config";
import app from "./app";
import { dataBaseConnection } from "./configs/dbConnection";

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  dataBaseConnection()
    .then(() => console.log(`Server running on port: ${PORT}`))
    .catch(() => console.error("Server error!"));
});
