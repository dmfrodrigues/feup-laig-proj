repo_name=laig-t02-g04
deploy_dir=~/public_html/feup/3/1
repo_path=$deploy_dir/$repo_name
original_repo = ~/feup/3S1/LAIG/laig-t02-g04

cd $original_repo

git pull
chmod 755 pull.sh

rm -rf $repo_path
mkdir -p $repo_path
cp lib TP1 TP2 TP3 pull.php $repo_path

echo "<!DOCTYPE html><html><body>Last updated "`date`"</body></html>" > $repo_path/index.html
