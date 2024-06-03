import {fileURLToPath, URL} from 'node:url'
// vite.config.ts
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'
import {prismjsPlugin} from 'vite-plugin-prismjs'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: [
                'vue',
                {
                    'naive-ui': [
                        'useDialog',
                        'useMessage',
                        'useNotification',
                        'useLoadingBar'
                    ]
                }
            ]
        }),
        Components({
            resolvers: [NaiveUiResolver()]
        }),
        prismjsPlugin({
            languages: ['html','javascript','css','sql','yaml','python', 'cpp', 'c', 'go','java'],
            plugins: ['line-numbers', 'show-language', 'copy-to-clipboard', 'normalize-whitespace'],
            theme: 'tomorrow',
            css: true
        }),
    ], resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
