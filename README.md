# CXS ARCHIVE — 데모 (GitHub 웹사이트에서 업로드하는 방법)

CXS ARCHIVE 프로젝트 아카이빙 웹앱의 정적 빌드본입니다. 명령 프롬프트(CMD)나 git
명령어 없이, GitHub 웹사이트에서 파일을 드래그해서 올리는 방식으로 배포할 수 있습니다.

## 안내

- 이 폴더에는 **빌드된 결과물만** 들어있습니다 (index.html, assets 폴더, 아이콘 파일).
  이 README.md는 올리지 않아도 됩니다.
- 로그인은 데모용 계정 선택 방식이며 실제 인증 서버는 없습니다. 모든 데이터는 각
  방문자의 브라우저(localStorage)에만 저장되므로 방문자마다 별도로 보입니다.
- 프로젝트/브랜드명은 전부 가상의 데모 데이터입니다.

## 배포 순서 (웹사이트에서 클릭·드래그만으로)

1. **github.com/new** 로 접속해 새 저장소를 만듭니다.
   - Repository name: 예) `cxs-archive-demo`
   - **Public**으로 선택 (무료 GitHub Pages를 쓰려면 Public이어야 합니다)
   - README, .gitignore, license는 전부 체크하지 말고 **빈 저장소로 생성**합니다.

2. 저장소가 만들어지면 뜨는 화면에서 **"uploading an existing file"** 링크를 클릭합니다.
   (이미 저장소를 만들었는데 이 화면이 안 보이면, 저장소 메인 페이지 우측 상단
   **Add file → Upload files** 버튼을 누르면 됩니다.)

3. 이 zip을 압축 해제한 **`cxs-archive-demo` 폴더를 통째로** 업로드 화면에 드래그해서
   놓습니다.
   - Chrome/Edge 브라우저는 폴더째 드래그하면 `assets` 폴더 구조까지 그대로
     유지해서 올려줍니다.
   - 만약 폴더 드래그가 안 되는 브라우저라면, 폴더 안으로 들어가서 `index.html`,
     `favicon.svg`, `icons.svg`와 `assets` 폴더를 각각 드래그해서 올려주세요
     (파일 탐색기/Finder에서 폴더 자체도 드래그 가능합니다).
   - **주의**: `cxs-archive-demo` 폴더 "안의 내용물"이 저장소 최상위(root)에
     바로 오도록 올려야 합니다. 즉 저장소를 열었을 때 `index.html`이 폴더 안이
     아니라 바로 보여야 합니다.

4. 화면 하단 **"Commit changes"** 버튼을 눌러 업로드를 완료합니다.

5. 저장소 메뉴에서 **Settings → Pages**로 이동합니다.
   - "Build and deployment" → Source를 **Deploy from a branch**로 둡니다.
   - Branch를 **main** / **`/(root)`** 로 선택하고 **Save**를 누릅니다.

6. 1~2분 정도 기다리면 같은 화면에
   `https://<본인계정>.github.io/<저장소이름>/` 형태의 주소가 표시됩니다.
   그 주소로 접속하면 데모 페이지가 공개된 것입니다.

※ 저장소 이름을 다른 걸로 바꿔도 상관없습니다 — 이 빌드는 상대 경로(`./assets/...`)로
만들어져 있어서 어떤 저장소 이름(서브 경로)에서 열어도 정상 동작합니다.

## 나중에 내용을 업데이트하고 싶을 때

새 빌드 파일을 받으면, 저장소 페이지에서 다시 **Add file → Upload files**로 같은
파일들을 올리고 "Commit changes"를 누르면 됩니다 (이름이 같은 파일은 자동으로
덮어써집니다). 1~2분 후 같은 주소에 반영됩니다.
