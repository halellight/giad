
import app from "./api/index";

const port = 5002;
app.listen(port, () => {
    console.log(`Reproduction server listening on port ${port}`);
});
