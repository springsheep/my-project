const files: any = import.meta.glob('./*.ts');
let modules: any = {}
Object.keys(files).filter((key: any) => key !== './api.ts').forEach((key: any) => {
  const keys = {}
  for (const v in files[key]) {
    Object.assign(keys, { [v]: files[key][v] })
  }
  modules[key.replace(/(\.\/module\/|\.ts)/g, '')] = keys
})


export default modules
