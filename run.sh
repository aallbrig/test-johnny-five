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
  ansible-playbook provisioning/setup-dev-machine.yml
  exit 0
}

function setup_windows {
  echo "windows"
}

case "$OSTYPE" in
  solaris*) echo "SOLARIS" ;;
  darwin*) setup_osx ;;
  linux*) echo "LINUX" ;;
  bsd*) echo "BSD" ;;
  msys*) setup_windows ;;
  *) echo "unknown: $OSTYPE" ;;
esac
