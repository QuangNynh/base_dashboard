## Git Flow – CARE Project (Multi-market: Laos Unitel & Cambodia Metfone)

---

### Branch Convention

| Branch                    | Purpose                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `common-module`           | Shared code base for **all markets** (Laos + Cambodia). All common features branch from here. |
| `development-laos-unitel` | Laos-specific development branch, aggregates all completed features for Laos                  |
| `development-cam-metfone` | Cambodia-specific development branch, aggregates all completed features for Cambodia          |
| `sandbox-unitel-laos`     | Laos DEV environment for tester verification                                                  |
| `sandbox-unitel-cam`      | Cambodia DEV environment for tester verification                                              |
| `production-laos-unitel`  | Laos production branch, used for go-live deployment                                           |
| `production-cam-metfone`  | Cambodia production branch, used for go-live deployment                                       |

---

### Working Process

#### For features shared across markets (common code)

1. **Checkout from `common-module`**
   - Always create feature branches from `common-module` for shared logic
   - Branch naming format:
     ```
     feature/CARE_MTM-XXXX (XXXX flow id JIRA)
     ```

   ```bash
   git checkout common-module
   git pull origin common-module
   git checkout -b feature/CARE_MTM-XXXX
   ```

2. **Development & self-testing**
   - Implement the feature and perform self-testing on the feature branch

3. **Merge to sandbox for testing**
   - Merge the feature branch into the sandbox branch of the target market for verification

   ```bash
   git checkout sandbox-unitel-laos   # or sandbox-unitel-cam
   git merge feature/CARE_MTM-XXXX
   ```

4. **Merge into `common-module`**
   - After testers confirm OK, merge the feature branch into `common-module`

   ```bash
   git checkout common-module
   git merge feature/CARE_MTM-XXXX
   git push origin common-module
   ```

5. **Sync to market branches**
   - Merge `common-module` into each market's development branch

   ```bash
   git checkout development-laos-unitel
   git merge common-module

   git checkout development-cam-metfone
   git merge common-module
   ```

6. **Go-live**
   - Merge market development branch into its production branch
   ```bash
   git checkout production-laos-unitel
   git merge development-laos-unitel
   ```

---

#### For features specific to one market only

1. **Checkout from market development branch**

   ```bash
   git checkout development-laos-unitel   # or development-cam-metfone
   git pull origin development-laos-unitel
   git checkout -b feature/CARE_MTM-XXXX
   ```

2. **Follow the same steps 2–6 above**, but merge only into the relevant market branch — do **not** merge into `common-module`.

---

### Branch Flow Diagram

```
common-module
    │
    ├──► feature/CARE_MTM-XXXX  (shared feature branch)
    │         │
    │         ▼
    │    sandbox-unitel-laos / sandbox-unitel-cam  (testing)
    │         │
    │         ▼
    └──► common-module  (merge back after approval)
              │
              ├──► development-laos-unitel ──► production-laos-unitel
              │
              └──► development-cam-metfone ──► production-cam-metfone
```

---

> ⚠️ **Note**
>
> - **Always branch from `common-module`** when the feature applies to both markets
> - **Never** commit market-specific code into `common-module`
> - Sync `common-module` into market branches regularly to avoid large merge conflicts
> - All web developers are required to strictly follow this Git Flow to ensure:
>   - A clear and controlled release process
>   - Reduced code conflicts between markets
>   - Stability in the production environment
