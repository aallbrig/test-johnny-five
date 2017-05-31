VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.ssh.insert_key = false
  config.ssh.forward_agent = true
  # config.ssh.insert_key = ""
  # config.ssh.keys_only = false
  # config.ssh.port = 2200
  # config.ssh.insert_key = false
  # config.ssh.private_key_path = ["~/.ssh/id_rsa", "~/.vagrant.d/insecure_private_key"]
  # config.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys"

  # config.ssh.username = "vagrant"
  # config.ssh.password = "vagrant"

  config.vm.box = "box-cutter/ubuntu1404-desktop"
  config.vm.hostname = "developer-machine"

  config.vm.synced_folder ".", "/vagrant", disabled: true  # Uncomment this if you want ansible_local to break.
  config.vm.synced_folder ".", "/home/vagrant/Desktop/code"

  config.vm.provider "virtualbox" do |vb|
    vb.gui = true
    vb.memory = 4096
    vb.cpus = 2
    vb.customize ['modifyvm', :id, '--clipboard', 'bidirectional']
    vb.customize ["modifyvm", :id, "--usb", "on"]
    vb.customize ["modifyvm", :id, "--usbehci", "on"]
    vb.customize ["modifyvm", :id, "--cpus", 2]
    vb.customize [
      'usbfilter', 'add', '0',
      '--target', :id,
      '--name', 'ESP',
      '--vendorid', '0x1a86',
      '--productid', '0x7523'
    ]
  end

  config.vm.provision "ansible_local" do |ansible|
    ansible.version = "latest"
    ansible.install = true
    ansible.playbook = "/home/vagrant/Desktop/code/provisioning/setup-dev-machine.yml"
    ansible.inventory_path = "/home/vagrant/Desktop/code/provisioning/HOSTS.ini"
    ansible.galaxy_role_file = "/home/vagrant/Desktop/code/provisioning/requirements.yml"
    ansible.galaxy_roles_path = "/home/vagrant/ansible-galaxy-roles"
    ansible.provisioning_path = "/home/vagrant/Desktop/code"
    ansible.limit = "local"
    ansible.verbose = "vvvv"
  end

end