function setup_osx {
  echo "osx"
  which -s brew
  if [[ $? != 0 ]] ; then
    echo "installing brew"
    /usr/bin/ruby -e "$(curl -fsSL https://raw.github.com/gist/323731)"
  else
    echo "updating brew"
    brew update
  fi
  brew ls --versions ansible
  if [[ $? != 0 ]] ; then
    echo "installing ansible"
    brew install ansible
  else
    echo "updating ansible"
    brew upgrade ansible
    echo "    ^-- error means you're already up to date."
  fi
  sudo pip install -r requirements.txt

  # Ansible install packages
  sudo ansible-galaxy install -r requirements.yml
  # Ansible install based on config values
  ansible-playbook setup.yml -i HOSTS --ask-sudo-pass  --module-path ./ansible_modules --extra-vars "@config.json"
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
