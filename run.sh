function setup_osx {
  echo "osx"
  # Install prerequisites.
  pip --version
  if [[ $? != 0 ]] ; then
    echo "No valid pip installed.  Installing..."
    sudo easy_install pip
  fi
  ansible --version
  if [[ $? != 0 ]] ; then
    echo "No valid ansible installed.  Installing..."
    sudo pip install ansible
  fi
  sudo ansible-galaxy install -r provisioning/requirements.yml

  # Provision dev machine.
  ansible-playbook provisioning/setup-dev-machine.yml -vv
  exit 0
}

function setup_windows {
  echo "windows"
}

case "$OSTYPE" in
  solaris*) echo "SOLARIS not supported.  Please find or report to https://github.com/aallbrig/test-johnny-five/issues" ;;
  darwin*) setup_osx ;;
  linux*) echo "LINUX not supported.  Please find or report to https://github.com/aallbrig/test-johnny-five/issues" ;;
  bsd*) echo "BSD not supported.  Please find or report to https://github.com/aallbrig/test-johnny-five/issues" ;;
  msys*) setup_windows ;;
  *) echo "unknown: $OSTYPE not supported.  Please find or report to https://github.com/aallbrig/test-johnny-five/issues" ;;
esac
