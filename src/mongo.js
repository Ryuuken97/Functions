const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const { promisify } = require("util");
const zlib = require("zlib");
const { Schema, connect, model } = mongoose;

const defaultOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const compress = promisify(zlib.gzip);
const decompress = promisify(zlib.gunzip);

class MONGODB {
  constructor(url, options = defaultOptions) {
    this.url = url;
    this.options = options;
    this.data = {};
    this.schema = {};
    this.model = {};
    this.db = connect(this.url, this.options);
  }

  async read() {
    await this.db;
    this.schema = new Schema({
      data: {
        type: String,
        required: true,
        default: "{}",
      },
    });
    this.model = model("data", this.schema);
    let compressedData = await this.model.findOne({}).select("data").exec();

    if (!compressedData) {
      this.data = {};
      await this.write(this.data);
      compressedData = await this.model.findOne({}).select("data").exec();
      log.success("New data created and saved");
    }

    try {
      this.data = compressedData?.data
        ? JSON.parse(
            (
              await decompress(Buffer.from(compressedData.data, "base64"))
            ).toString(),
          )
        : {};
    } catch (err) {
      console.error("Failed to decompress or parse data");
      this.data = {};
    }
    return this.data;
  }

  async write(data) {
    if (!data || typeof data !== "object") {
      console.warn("Invalid data provided for write operation");
      return Promise.reject("Invalid data");
    }
    try {
      const jsonData = JSON.stringify(data);
      const minifiedJsonData = JSON.stringify(JSON.parse(jsonData));
      const compressedData = await compress(Buffer.from(minifiedJsonData), {
        level: zlib.constants.Z_BEST_COMPRESSION,
      });
      await this.model.findOneAndUpdate(
        {},
        {
          $set: {
            data: compressedData.toString("base64"),
          },
        },
        {
          upsert: true,
          new: true,
          lean: true,
        },
      );
      console.log("Data successfully updated in the database");
      return true;
    } catch (err) {
      console.error(`Failed to write data: ${err.message}`);
      return Promise.reject(err);
    }
  }
}

module.exports = { MONGODB };