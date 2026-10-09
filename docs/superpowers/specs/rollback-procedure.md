# Rollback Procedure

If standardize-rules cause issues, rollback toan bo:

```bash
git checkout docs/standardize-rules-utf8
git reset --hard baseline-before-utf8
git tag -d baseline-before-utf8
```

Luu y: baseline tag chi luu local, khong push. Neu da push nhanh, dung `git revert` tung commit theo thu tu nguoc.
