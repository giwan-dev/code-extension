import * as vscode from "vscode";

export async function activate(context: vscode.ExtensionContext) {
  const { $ } = await import("zx");

  if (vscode.workspace.workspaceFolders) {
    $.cwd = vscode.workspace.workspaceFolders[0].uri.path;
  } else {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  let disposable = vscode.commands.registerCommand(
    "giwan-code-extension.selectBaseBranch",
    async () => {
      const commit = (await $`git rev-parse HEAD`).toString().trim();
      const branches = await findOtherBranches(commit);

      const selectedBranch = await pickOneBranch(branches);
      if (selectedBranch === undefined) {
        return;
      }

      vscode.env.clipboard.writeText(selectedBranch);
      vscode.window.showInformationMessage(`${selectedBranch} 복사됨!`);
    }
  );

  context.subscriptions.push(disposable);

  /**
   * 지정된 커밋을 포함하는 다른 브랜치를 가져옵니다.
   * 커밋이 어떤 브랜치에도 없는 경우, 커밋의 부모 커밋을 재귀적으로 검색하고 프로세스를 반복합니다.
   * @param commit 검색할 커밋 해시입니다.
   * @returns 커밋을 포함하는 브랜치 이름의 배열이거나, 어떤 브랜치에도 커밋이 없는 경우 빈 배열입니다.
   */
  async function findOtherBranches(commit: string) {
    const otherBranches = (await $`git branch --contains ${commit}`)
      .toString()
      .split("\n")
      .map((line) => line.trim())
      .filter((x) => !!x)
      .filter((branch) => branch.startsWith("* ") === false);

    if (otherBranches.length > 0) {
      return otherBranches;
    }

    const parentCommit = (await $`git rev-parse ${commit}^`).toString().trim();
    if (!parentCommit) {
      return [];
    }

    return findOtherBranches(parentCommit);
  }
}

async function pickOneBranch(branches: string[]): Promise<string | undefined> {
  if (branches.length === 1) {
    const [branch] = branches;
    return branch;
  }

  const selectedBranch = await vscode.window.showQuickPick(branches);
  return selectedBranch;
}

export function deactivate() {}
