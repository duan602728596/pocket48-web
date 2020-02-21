/* 配置使用模块的别名 */
import moduleAlias from 'module-alias';

// http-proxy模块不支持http2
moduleAlias.addAlias('http-proxy', '@bbkkbkk/http-proxy');