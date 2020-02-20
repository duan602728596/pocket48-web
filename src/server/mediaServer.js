import process from 'process';
import path from 'path';
import NodeMediaServer from 'node-media-server';

const { env } = process;

function mediaServer(isDev, isHttps) {
  const config = {
    rtmp: {
      port: 13345,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: 13346,
      allow_origin: isDev ? 'http://127.0.0.1:7070' : 'http://www.wbwbwb.top'
    }
  };

  if (isHttps) {
    config.https = {
      port: 13347,
      key: path.join(__dirname, '../..', env.KEY),
      cert: path.join(__dirname, '../..', env.CERT),
      allow_origin: isDev ? 'http://127.0.0.1:7070' : 'https://www.wbwbwb.top'
    };
  }

  const server = new NodeMediaServer(config);

  server.run();
}

export default mediaServer;