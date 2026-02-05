---
description: Deploy para Vercel via GitHub
---

# Deploy Flash Catu

## Informações do Projeto
- **Repo:** LaioBomfimDev/Flash-Delivery1
- **Branch local:** master
- **Branch GitHub:** main
- **Vercel URL:** https://flash-delivery1.vercel.app/

## Passos para Deploy

// turbo
1. Adicionar todas as mudanças
```bash
git add -A
```

2. Fazer commit
```bash
git commit -m "feat: descrição das mudanças"
```

3. Push para GitHub (IMPORTANTE: master → main)
```bash
git push origin master:main
```

## Verificar se Subiu
```powershell
Invoke-RestMethod -Uri "https://api.github.com/repos/LaioBomfimDev/Flash-Delivery1/commits/main" | Select-Object -ExpandProperty commit | Select-Object -ExpandProperty message
```

## Problemas Comuns

### "src refspec main does not match"
A branch local é `master`, não `main`. Use:
```bash
git push origin master:main
```

### Vercel não atualiza
1. Verificar se o projeto está importado no Vercel
2. Ir em https://vercel.com/new e importar LaioBomfimDev/Flash-Delivery1
3. Configurar:
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
